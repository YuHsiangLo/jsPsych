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
            start_arrow_x_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Start arrow x position',
                default: 0,
                description: 'x position for the start arrow point in pixel.'
            },
            start_arrow_y_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Start arrow y position',
                default: 0,
                description: 'y position for the start arrow point in pixel.'
            },
            end_arrow_x_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'End arrow x position',
                default: 0,
                description: 'x position for the end arrow point in pixel.'
            },
            end_arrow_y_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'End arrow y position',
                default: 0,
                description: 'y position for the end arrow point in pixel.'
            },
            show_hint: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Show hints or not',
                default: false,
                description: 'If true, a hint will show next to fixation.'
            },
            show_hint_arrow: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Show hint arrow or not',
                default: false,
                description: 'If true, a hint arrow will be displayed.'
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

        const background = document.createElement('div');
        background.style.display = 'block';
        background.style.position = 'absolute';
        background.style.width = trial.zone_width.toString() + 'px';
        background.style.height = trial.zone_height.toString() + 'px';
        background.style.padding = '0';
        background.style.margin = 'auto';
        background.style.left = '0';
        background.style.right = '0';
        background.style.top = '0';
        background.style.bottom = '0';

        if (trial.show_hint_arrow) {
            background.innerHTML = `
            <svg width="${trial.zone_width}" height="${trial.zone_height}">
            <defs>
                <style>
                    line {
                        stroke-dasharray: 11, 5;
                        stroke: #176f58;
                    }
                </style>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#176f58">
            </marker>
            </defs>
            <line x1="${trial.zone_width/2 + trial.start_arrow_x_pos}"
                  y1="${trial.zone_height/2 - trial.start_arrow_y_pos}"
                  x2="${trial.zone_width/2 + trial.end_arrow_x_pos}"
                  y2="${trial.zone_height/2 - trial.end_arrow_y_pos}"
                  stroke-width="1" marker-end="url(#arrowhead)">
            </svg>
            `;
        }

        const tracking_zone = document.createElement('div');
        tracking_zone.style.display = 'block';
        tracking_zone.style.position = 'absolute';
        tracking_zone.style.width = trial.zone_width + 'px';
        tracking_zone.style.height = trial.zone_height + 'px';
        tracking_zone.style.padding = '0';
        tracking_zone.style.margin = 'auto';
        tracking_zone.style.left = '0';
        tracking_zone.style.right = '0';
        tracking_zone.style.top = '0';
        tracking_zone.style.bottom = '0';
        background.appendChild(tracking_zone);

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
            fixation_text.style.color = '#a81e32';
            fixation_text.textContent = 'hover';
            tracking_zone.appendChild(fixation_text);
        }

        const fixation_point = document.createElement('div');
        fixation_point.id = 'jspsych-fixation-hover';
        fixation_point.style.display = 'block';
        fixation_point.style.position = 'absolute';
        fixation_point.style.width = (trial.fixation_radius * 2) + 'px';
        fixation_point.style.height = (trial.fixation_radius * 2) + 'px';
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
        display_element.appendChild(background);

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
