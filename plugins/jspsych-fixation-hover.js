jsPsych.plugins['fixation-hover'] = (function() {
    const plugin = {};

    plugin.info = {
        name: 'fixation-hover',
        description: '',
        parameters: {
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
            x_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'x position',
                default: 0,
                description: 'x position of the fixation.'
            },
            y_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'y position',
                default: 0,
                description: 'y position of the fixation.'
            },
            fixation_radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Fixation radius',
                default: 5,
                description: 'Fixation radius.'
            },
            show_hint: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Show hints or not',
                default: false,
                description: 'If true, a hint will show next to fixation.'
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
        // Ref: https://www.smashingmagazine.com/2013/08/absolute-horizontal-vertical-centering-css/

        const tracking_zone = document.createElement('div');
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

        for (let i = 0; i < trial.responses.length; i++) {
            const response = trial.responses[i];
            const response_square = document.createElement('div');
            response_square.style.position = 'absolute';
            response_square.style.top = (trial.zone_height/2 - response.y_pos - response.response_height/2) + 'px';
            response_square.style.left = (trial.zone_width/2 + response.x_pos - response.response_width/2) + 'px';
            response_square.style.width = response.response_width + 'px';
            response_square.style.lineHeight = response.response_height + 'px';
            response_square.style.padding = '0';
            response_square.style.border = '1px solid black';
            response_square.style.textAlign = 'center';
            response_square.textContent = response.label;
            tracking_zone.appendChild(response_square);
        }

        if (trial.show_hint) {
            const fixation_text = document.createElement('div');
            fixation_text.style.position = 'absolute';
            fixation_text.style.width = '70px';
            fixation_text.style.lineHeight = '20px';
            fixation_text.style.top = (trial.zone_height / 2 - trial.y_pos - 10) + 'px';
            fixation_text.style.left = (trial.zone_width / 2 + trial.x_pos) + 'px';
            fixation_text.style.padding = '0';
            fixation_text.style.textAlign = 'center';
            fixation_text.style.color = 'red';
            fixation_text.textContent = 'hover';
            tracking_zone.appendChild(fixation_text);
        }

        const fixation_point = document.createElement('div');
        fixation_point.id = 'jspsych-fixation-hover';
        fixation_point.style.display = 'block';
        fixation_point.style.position = 'absolute';
        fixation_point.style.width = (trial.fixation_radius * 2).toString() + 'px';
        fixation_point.style.height = (trial.fixation_radius * 2).toString() + 'px';
        fixation_point.style.margin = 'auto';
        fixation_point.style.padding = '0';
        fixation_point.style.borderRadius = '50%';
        fixation_point.style.backgroundColor = 'black';
        fixation_point.style.left = '0';
        fixation_point.style.right = '0';
        fixation_point.style.top = '0';
        fixation_point.style.bottom = '0';
        tracking_zone.appendChild(fixation_point)

        display_element.innerHTML = '';
        display_element.appendChild(tracking_zone);

        display_element.querySelector('#jspsych-fixation-hover')
            .addEventListener('mouseenter', function(e) {
                after_response();
            });

        // store response
        const response = {
            rt: null
        }

        // function to handle responses by the subject
        function after_response() {

            // measure rt
            response.rt = performance.now() - start_time;

            end_trial();
        }

        // function to end trial when it is time
        function end_trial() {

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // gather the data to store for the trial
            const trial_data = {
                'rt': response.rt
            };

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }

        // start time
        const start_time = performance.now();

    };

    return plugin;
})();
