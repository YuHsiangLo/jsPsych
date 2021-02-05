jsPsych.plugins['calibration'] = (function() {
    const plugin = {};

    plugin.info = {
        name: 'calibration',
        description: '',
        parameters: {
            show_timer: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Show timer',
                default: false,
                description: 'Whether to show timer or not.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'The maximum duration to wait for a response.'
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
            start_x_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Start x position',
                default: 0,
                description: 'x position for the start point in pixel.'
            },
            start_y_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Start y position',
                default: 0,
                description: 'y position for the start point in pixel.'
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
            start_radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Start point radius',
                default: 5,
                description: 'Start point radius.'
            },
            end_x_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'End x position',
                default: 0,
                description: 'x position for the end point in pixel.'
            },
            end_y_pos: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'End y position',
                default: 0,
                description: 'y position for the end point in pixel.'
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
            end_radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Start point radius',
                default: 5,
                description: 'Start point radius.'
            },
            show_hint_arrow: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Show hint arrow or not',
                default: false,
                description: 'If true, a hint arrow will be displayed.'
            },
            show_hint: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Show hint or not',
                default: false,
                description: 'If true, a hint will be displayed.'
            },
        }
    }

    plugin.trial = function(display_element, trial) {

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
        tracking_zone.id = 'jspsych-calibration-tracking-zone';
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
        background.appendChild(tracking_zone);

        //const start_point = document.createElement('div');
        //start_point.id = 'jspsych-calibration-start';
        //start_point.style.position = 'absolute';
        //start_point.style.top = (trial.zone_height/2 - trial.start_y_pos - trial.start_radius) + 'px';
        //start_point.style.left = (trial.zone_width/2 + trial.start_x_pos - trial.start_radius) + 'px';
        //start_point.style.width = (trial.start_radius * 2).toString() + 'px';
        //start_point.style.height = (trial.start_radius * 2).toString() + 'px';
        //start_point.style.padding = '0';
        //start_point.style.borderRadius = '50%';
        //start_point.style.backgroundColor = 'black';
        //tracking_zone.appendChild(start_point);

        if (trial.show_hint) {
            const fixation_text = document.createElement('div');
            fixation_text.style.position = 'absolute';
            fixation_text.style.width = '70px';
            fixation_text.style.lineHeight = '20px';
            fixation_text.style.top = (trial.zone_height / 2 - trial.end_y_pos - 10) + 'px';
            fixation_text.style.left = (trial.zone_width / 2 + trial.end_x_pos) + 'px';
            fixation_text.style.padding = '0';
            fixation_text.style.textAlign = 'center';
            fixation_text.style.color = '#a81e32';
            fixation_text.textContent = 'click';
            tracking_zone.appendChild(fixation_text);
        }

        const end_point = document.createElement('div');
        end_point.id = 'jspsych-calibration-end';
        end_point.style.position = 'absolute';
        end_point.style.top = (trial.zone_height/2 - trial.end_y_pos - trial.end_radius) + 'px';
        end_point.style.left = (trial.zone_width/2 + trial.end_x_pos - trial.end_radius) + 'px';
        end_point.style.width = (trial.end_radius * 2).toString() + 'px';
        end_point.style.height = (trial.end_radius * 2).toString() + 'px';
        end_point.style.padding = '0';
        end_point.style.borderRadius = '50%';
        end_point.style.backgroundColor = 'black';
        end_point.style.cursor = 'pointer';
        tracking_zone.appendChild(end_point);

        display_element.innerHTML = '';
        display_element.appendChild(background);

        display_element.querySelector('#jspsych-calibration-end')
            .addEventListener('click', function(e) {
                after_response();
            });

        if (trial.show_timer) {
            const FULL_DASH_ARRAY = 283;
            const WARNING_THRESHOLD = 10;
            const ALERT_THRESHOLD = 5;

            const COLOR_CODES = {
                info: {
                    color: "green"
                },
                warning: {
                    color: "orange",
                    threshold: WARNING_THRESHOLD
                },
                alert: {
                    color: "red",
                    threshold: ALERT_THRESHOLD
                }
            };

            const TIME_LIMIT = trial.trial_duration / 1000;
            let timePassed = 0;
            let timeLeft = TIME_LIMIT;
            let timerInterval = null;
            let remainingPathColor = COLOR_CODES.alert.color;

            const timer = document.createElement('div');
            timer.id = 'timer';
            timer.classList.add('base-timer');
            timer.style.position = 'absolute';
            timer.style.padding = '0';
            timer.style.right = '25px';
            timer.style.bottom = '25px';
            timer.innerHTML = `
            <svg class="base-timer__svg" width="100" height="100">
                <g class="base-timer__circle">
                    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                        <path
                            id="base-timer-path-remaining"
                            class="base-timer__path-remaining ${remainingPathColor}"
                            stroke-dasharray="283"
                            d="
                            M 50, 50
                            m -45, 0
                            a 45,45 0 1,0 90,0
                            a 45,45 0 1,0 -90,0
                            "
                        ></path>
                </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>`;
            display_element.appendChild(timer);

            startTimer();

            function onTimesUp() {
                clearInterval(timerInterval);
            }

            function startTimer() {
                timerInterval = setInterval(() => {
                    timePassed = timePassed += 1;
                    timeLeft = TIME_LIMIT - timePassed;
                    document.getElementById('base-timer-label').innerText = formatTime(
                        timeLeft
                    );
                    setCircleDasharray();
                    setRemainingPathColor(timeLeft);

                }, 1000);
            }

            function formatTime(time) {
                let seconds = time % 60;

                if (seconds < 10) {
                    seconds = `${seconds}`;
                }

                return `${seconds}`;
            }

            function setRemainingPathColor(timeLeft) {
                const { alert, warning, info } = COLOR_CODES;
                if (timeLeft <= alert.threshold) {
                    document.getElementById('base-timer-path-remaining').classList.remove(warning.color);
                    document.getElementById('base-timer-path-remaining').classList.add(alert.color);
                } else if (timeLeft <= warning.threshold) {
                    document.getElementById('base-timer-path-remaining').classList.remove(info.color);
                    document.getElementById('base-timer-path-remaining').classList.add(warning.color);
                }
            }

            function calculateTimeFraction() {
                const rawTimeFraction = timeLeft / TIME_LIMIT;
                return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
            }

            function setCircleDasharray() {
                const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
                document.getElementById('base-timer-path-remaining').setAttribute('stroke-dasharray', circleDasharray);
            }
        }

        const xs = [];
        const ys = [];
        const timestamps = [];

        tracking_zone.addEventListener('mousemove', e => {
            timestamps.push(performance.now() - start_time);
            xs.push(e.offsetX - trial.zone_width / 2.0);
            ys.push(trial.zone_height / 2 - e.offsetY);

        })

        // store response
        const response = {
            rt: null
        };

        // function to handle responses by the subject
        function after_response(choice) {

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
                'rt': response.rt,
                'timestamps_get_response': '[' + timestamps.toString() + ']',
                'xpos_get_response': '[' + xs.toString() + ']',
                'ypos_get_response': '[' + ys.toString() + ']'
            };

            if (trial.show_timer) {
                onTimesUp();
            }

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }

        // start time
        const start_time = performance.now();

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function() {
                end_trial();
            }, trial.trial_duration);
        }

    };

    return plugin;
})();
