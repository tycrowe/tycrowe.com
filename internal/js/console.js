// Constants
let textSize = 16;
let consoles = {}


/**
 * Basically adds the <p></p> tags for each string in array of history, backwards,
 * to the specified output console. (From bottom to top)
 * @param _console: The console to glamorize.
 * @param spacing: The number of pixels between each historical element.
 */
function glamorizeConsoleOutput(_console, spacing = (textSize + 4)) {
    if (_console && _console['output'].length > 0) {
        _console['target'].innerHTML = "";

        for (let i = 0; i < _console['output'].length; i++) {
            let tempText = "> " + _console['output'][i]
            _console['target'].innerHTML += "<div><p>" + tempText + "</p></div>"
            _console['target'].scrollTop = 0;
        }
    }
}


function interpretCommandsOfOutput() {
    $('.command').map(function () {
        this.onclick = function () {
            let console = $('#' + $(this).data('console')).get(0);
            console.value = '/' + $(this).data('command');
            console.focus()
        };
    })
}

function outputConsoleText(_console, text) {
    if (_console && text.length > 2) {
        let input = _console['history'][_console['history'].push(text.substr(1, text.length)) - 1];
        let args = input.split(' ');
        input = args.shift();
        let command = _console['commands'][input];
        
        function publish(text, has_backend= false) {
            // Process possible input.
            _console['output'].push(text);

            glamorizeConsoleOutput(_console);
            _console['object'].value = "";
            if (_console['history'].length > _console['max-size']) {
                _console['history'].shift();
            }

            if (has_backend) {
                // process backend function for command
                command['backend']();
            }
        }
        if (command) {
            switch (input.toLowerCase()) {
                case "info":
                    let rIndex = Math.floor(Math.random() * command['output'].length);
                    console.log(command['output'][rIndex]);
                    publish(command['output'][rIndex] + "<br><br><a class='command' data-command='info' data-console='index-console-input'>/info</a> for more!", true);
                    break;
                case "goto":
                    if (args.length === 0) {
                        publish('error_404', true);
                    } else if (args.length === 1) {
                        publish(command['output'], false);
                        setTimeout(function () {
                            window.location.href = 'internal/pages/' + args[0].toLowerCase() + '.html';
                        }, 200);
                    }
                    break;
                default:
                    publish(command['output'], true);
                    break;
            }
        }
    }
}

function mapConsoles() {
    $('.console').map(function () {
        consoles[this.id] = {
            'object': this,
            'target': $('#' + $(this).data('output')).get(0),
            'history': [],
            'output': [],
            'max-size': 30
        }
    })
}


$(document).ready(function () {
    // Get our consoles
    mapConsoles();

    // Set our "enter" listener, for the specified listener
    $('#index-console-input').keydown(function (e) {
        if (this.value.charAt(0) !== '/') {
            this.value = '/' + this.value;
        }
        // Add that slash
        if (e.which !== 191 && this.value.length === 0) {
            this.value = '/' + this.value;
        } else if(e.which === 191 && this.value.length === 1) {
            e.preventDefault();
        }
        // Get last entry, if able.
        if (e.which === 38 && consoles[this.id]['history'].length > 0) {
            this.value = '/' + consoles[this.id]['history'].at(-1);
        }
        // Process on enter
        if (e.which === 13) {
            e.preventDefault();
            outputConsoleText(consoles[this.id], this.value)
        }
    });

    interpretCommandsOfOutput();

    // Setup commands for this console.
    consoles['index-console-input']['commands'] = {
        "help": {
            "output": "Hint: click anything in <span style='color: red;'>red</span>!<br><a class='command' data-command='help' data-console='index-console-input'>/help</a>: Displays this message!" +
                "<br><a class='command' data-command='ls' data-console='index-console-input'>/ls</a>: Lists all files in site directory." +
                "<br><a class='command' data-command='info' data-console='index-console-input'>/info</a>: Prints out info on yours truly." +
                "<br><a class='command' data-command='goto' data-console='index-console-input'>/goto</a>: Go to a certain page from the site directory.",
            "backend": interpretCommandsOfOutput
        },
        "ls": {
            "output": "Site directory:" +
                "<br><a class='command' data-command='goto main' data-console='index-console-input'>/goto main</a>: The main site. [<a href='internal/pages/main.html'>Link</a>]" +
                "<br><a class='command' data-command='goto blog' data-console='index-console-input'>/goto blog</a>: I write about what interests me, books, games, shows, projects, et cetera. [<a href='internal/pages/blog.html'>Link</a>]" +
                "<br><a class='command' data-command='goto portfolio' data-console='index-console-input'>/goto portfolio</a>: What I do, how I do it, and kinda why I do it. [<a href='internal/pages/portfolio.html'>Link</a>]" +
                "<br><a class='command' data-command='goto games' data-console='index-console-input'>/goto games</a>: I sometimes write cool mini-games! Check them out! [<a href='internal/pages/games.html'>Link</a>]",
            "backend": interpretCommandsOfOutput
        },
        "info": {
            "output": [
                "For the most up-to-date info on me and what I do, check out my online resume: [<a href='internal/pages/portfolio.html'>Link</a>]",
                "Did you know you can read this in the source code? Check out my <a href='https://github.com/tycrowe?tab=repositories'>GitHub!</a>",
                "Did you know that Louisville, KY is the 29th most populous state in the US? Moreover, only three states can be referred to as \'Commonwealths\': Pennsylvania, Massachusetts and Kentucky!",
                "While my degree is in Data Science from University of North Carolina at Charlotte, I've been practicing Software Engineering since I was 14!",
                "I gained my first \'Senior\' title a year into my first job at 27 years old!",
                "Before graduating, I curated and maintained my own research project at UNCC. Check out my <a href='internal/pages/portfolio.html'>portfolio</a> for more information!",
                "Did you know I also write and maintain video-game mods? Check out my <a href='https://github.com/tycrowe?tab=repositories'>GitHub</a> to judge my spaghetti!",
                "I primarily work with Cloud based systems and maintain backend infrastructures! However, I'm not a stranger to frontend development and even have knowledge of mobile development!",
                "My hobbies include surfing, dungeons and dragons, photography, programming, video games and biking!",
                "Did you know I maintain a <a href='internal/pages/blog.html'>blog</a>? I typically write about technology but occasionally other weird tidbits.",
            ],
            "backend": interpretCommandsOfOutput
        },
        "goto": {
            "output": "Navigating! See you later!",
            "error_404": "Command Failed! Missing destination Try: <a class='command' data-command='ls' data-console='index-console-input'>/ls</a> to find all pages in directory.",
            "backend": interpretCommandsOfOutput
        },
        "noah": {
            "output": "Thank you for your interest in my late dog, Noah :) ♥ you bud. <img src='internal/img/noah0.jpg' alt='noah my boy'>",
            "backend": interpretCommandsOfOutput
        },
        "ping": {
            "output": "PONG!",
            "backend": interpretCommandsOfOutput
        }
    }

    setTimeout(function () {
        outputConsoleText(consoles['index-console-input'], '/help');
    }, 100);
});