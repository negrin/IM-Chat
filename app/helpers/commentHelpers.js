export const getCommentCommandAndParams = (comment) => {
    if (comment.text[0] === '/') {
        return comment.text.substr(1).split(' ', 2);
    }
    return null;
};

export const getCommentCommand = (comment) => {
    const commandParsed = getCommentCommandAndParams(comment);
    return commandParsed && commandParsed[0];
};

export const getCommentCommandParam = (comment) => {
    const commandParsed = getCommentCommandAndParams(comment);
    return commandParsed && commandParsed[1];
};

export const CommandType = {
    ADD: 'add',
    VOLUME: 'volume',
    PAUSE: 'pause',
    PLAY: 'play',
    FULL: 'full',
    NEXT: 'next',
    HELP: 'help',
    NONE: ''
};

export const parseCommentCommand = (command) => {
    switch (command) {
        case 'volume':
        case 'vol':
            return CommandType.VOLUME;
        case 'stop':
        case 'pause':
            return CommandType.PAUSE;
        case 'play':
            return CommandType.PLAY;
        case 'full':
            return CommandType.FULL;
        case 'add':
            return CommandType.ADD;
        case 'next':
            return CommandType.NEXT;
        case 'help':
            return CommandType.HELP;
        default:
            return CommandType.NONE;
    }
};


