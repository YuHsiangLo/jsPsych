jsPsych.plugins['mouse-tracking-fixation'] = (function() {
    const plugin = {};

    plugin.info = {
        name: 'mouse-tracking-fixation',
        description: '',
        parameters: {
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
            }
        }
    }

    plugin.trial = function(display_element, trial) {
        // Ref: https://www.smashingmagazine.com/2013/08/absolute-horizontal-vertical-centering-css/

        const fixation_point = document.createElement('div');
        fixation_point.id = 'jspsych-mouse-tracking-fixation';
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

        display_element.innerHTML = '';
        display_element.appendChild(fixation_point);

        display_element.querySelector('#jspsych-mouse-tracking-fixation')
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
