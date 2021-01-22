jsPsych.plugins['audio-mouse-tracking'] = (function() {
    const plugin = {};

    jsPsych.pluginAPI.registerPreload('audio-mouse-tracking', 'stimulus', 'audio');

    plugin.info = {
        name: 'audio-mouse-tracking',
        description: '',
        parameters: {
            stimulus: {
                type: jsPsych.plugins.parameterType.AUDIO,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The audio to be played.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'The maximum duration to wait for a response.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: true,
                description: 'If true, the trial will end when user makes a response.'
            },
            trial_ends_after_audio: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Trial ends after audio',
                default: false,
                description: 'If true, then the trial will end as soon as the audio file finishes playing.'
            },
            zone_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Tracking zone width',
                default: 500,
                description: 'Mouse-tracking zone width.'
            },
            zone_height: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Tracking zone height',
                default: 500,
                description: 'Mouse-tracking zone height.'
            },
            responses: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                array: true,
                pretty_name: 'Response options',
                nested: {
                    label: {
                        type: jsPsych.plugins.parameterType.STRING,
                        pretty_name: 'Label',
                        default: undefined,
                        description: 'Label for the response.'
                    },
                    x_pos: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'x position',
                        default: 100,
                        description: 'x position for the response in pixel'
                    },
                    y_pos: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'y position',
                        default: 100,
                        description: 'y position for the response in pixel'
                    },
                    response_width: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'Label width',
                        default: 50,
                        description: 'Width for the label square'
                    },
                    response_height: {
                        type: jsPsych.plugins.parameterType.INT,
                        pretty_name: 'Label height',
                        default: 50,
                        description: 'Height for the label square'
                    }
                }
            }
        }
    }

    plugin.trial = function(display_element, trial) {

        // setup stimulus
        const context = jsPsych.pluginAPI.audioContext();
        let source;
        let audio;

        if (context !== null) {
            source = context.createBufferSource();
            source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
            source.connect(context.destination);
        } else {
            audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
            audio.currentTime = 0;
        }

        // set up end event if trial needs it
        if (trial.trial_ends_after_audio) {
            if (context !== null) {
                source.addEventListener('ended', end_trial);
            } else {
                audio.addEventListener('ended', end_trial);
            }
        }

        const tracking_zone = document.createElement('div');
        tracking_zone.id = 'jspsych-audio-mouse-tracking-zone';
        tracking_zone.setAttribute('data-choice', '-1');
        tracking_zone.style.display = 'block';
        tracking_zone.style.position = 'absolute';
        tracking_zone.style.width = trial.zone_width.toString() + 'px';
        tracking_zone.style.height = trial.zone_height.toString() + 'px';
        tracking_zone.style.padding = '0';
        tracking_zone.style.margin = 'auto';
        tracking_zone.style.left = '0';
        tracking_zone.style.right = '0';
        tracking_zone.style.top = '0';
        tracking_zone.style.bottom = '0';

        //tracking_zone.style.display: flex; // make us of Flexbox
        //tracking_zone.style.align-items: center; // does vertically center the desired content
        //tracking_zone.style.justify-content: center; // horizontally centers single line items
        //tracking_zone.style.text-align: center; // optional, but helps horizontally center text that breaks into multiple lines

        for (let i = 0; i < trial.responses.length; i++) {
            const response = trial.responses[i];
            const response_square = document.createElement('div');
            response_square.id = 'jspsych-audio-mouse-tracking-response-' + i.toString();
            response_square.classList.add('jspsych-audio-mouse-tracking-response');
            response_square.setAttribute('data-choice', i.toString());
            response_square.style.position = 'absolute';
            response_square.style.top = (trial.zone_height/2 - response.y_pos - response.response_height/2) + 'px';
            response_square.style.left = (trial.zone_width/2 + response.x_pos - response.response_width/2) + 'px';
            response_square.style.width = response.response_width + 'px';
            response_square.style.lineHeight = response.response_height + 'px';
            response_square.style.padding = '0';
            response_square.style.border = '1px solid black';
            response_square.style.textAlign = 'center';
            response_square.style.cursor = 'pointer';
            response_square.textContent = response.label;
            tracking_zone.appendChild(response_square);
        }

        display_element.innerHTML = '';
        display_element.appendChild(tracking_zone);

        const xs = [];
        const ys = [];
        const timestamps = [];

        tracking_zone.addEventListener('mousemove', e => {
            const id = parseInt(document.elementFromPoint(e.x, e.y).getAttribute('data-choice'));
            if (id !== -1) {
                const res = trial.responses[id];
                timestamps.push(performance.now() - start_time);
                xs.push(res.x_pos - res.response_width/2 + e.offsetX);
                ys.push(res.y_pos + res.response_height/2 - e.offsetY);

                //console.log(res.x_pos - res.response_width/2 + e.offsetX)
                //console.log(res.y_pos + res.response_height/2 - e.offsetY)
            } else {
                timestamps.push(performance.now() - start_time);
                xs.push(e.offsetX - trial.zone_width / 2.0);
                ys.push(trial.zone_height / 2 - e.offsetY);

                //console.log('x:', e.offsetX - trial.zone_width / 2.0); //- trial.zone_width/2);
                //console.log('y:', trial.zone_height / 2 - e.offsetY);
            }
        })

        for (let i = 0; i < trial.responses.length; i++) {
            display_element.querySelector('#jspsych-audio-mouse-tracking-response-' + i)
                .addEventListener('click', function(e){
                    const choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
                    after_response(choice);
            });
        }

        // store response
        const response = {
            rt: null,
            button: null
        };

        // function to handle responses by the subject
        function after_response(choice) {

            // measure rt
            const end_time = performance.now();
            const rt = end_time - start_time;
            response.button = choice;
            response.rt = rt;

            // disable all the buttons after a response
            const btns = document.querySelectorAll('.jspsych-audio-mouse-tracking-response');
            for (let i = 0; i < btns.length; i++) {
                //btns[i].removeEventListener('click');
                btns[i].setAttribute('disabled', 'disabled');
            }

            if (trial.response_ends_trial) {
                end_trial();
            }
        }

        // function to end trial when it is time
        function end_trial() {

            // stop the audio file if it is playing
            // remove end event listeners if they exist
            if (context !== null) {
                source.stop();
                source.onended = function() {}
            } else {
                audio.pause();
                audio.removeEventListener('ended', end_trial);
            }

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // gather the data to store for the trial
            const trial_data = {
                'rt': response.rt,
                'stimulus': trial.stimulus,
                'button_pressed': response.button,
                'timestamps_get_response': '[' + timestamps.toString() + ']',
                'xpos_get_response': '[' + xs.toString() + ']',
                'ypos_get_response': '[' + ys.toString() + ']'
            };

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }

        // start time
        const start_time = performance.now();

        // start audio
        if (context !== null) {
            const startTime = context.currentTime;
            source.start(startTime);
        } else {
            audio.play();
        }

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.trial_duration);
        }

    };

    return plugin;
})();
