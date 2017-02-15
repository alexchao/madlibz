const React = require('react');
const ReactDOM = require('react-dom');


WordType = {
    NOUN: 0,
    VERB: 1,
    ADJECTIVE: 2,
    ADVERB: 3,
    CELEBRITY: 4
};


// Preceded by "Please enter "
WordTypeDesc = {
    0: 'a noun',
    1: 'a verb',
    2: 'an adjective',
    3: 'an adverb',
    4: 'the name of a celebrity'
};


const isValidWord = function(s) {
    if (typeof s !== 'string') {
        return false;
    }
    if (s.length < 1) {
        return false;
    }
    return true;
};


class FillInTheBlank extends React.Component {
    constructor() {
        super();
        this.setState({
            value: null
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let word = e.target.value;
        if (isValidWord(word)) {
            // record value and move on
            // TODO: probably need to do this at the MadLibzGame level
        }
    }

    render() {
        let inputId = 'id-' + this.props.id;
        return (
            <li>
                <form onSubmit={this.handleSubmit}>
                    <p>Please enter {this.props.desc}</p>
                    <input id={inputId} />
                    <button type="submit">Submit</button>
                </form>
            </li>
        );
    }
}


class Story extends React.Component {
    constructor() {
        super();
        this.setState({ completedStory: null });
    }
    render() {
        return (
            <div>{this.state.completedStory}</div>
        );
    }
}


class MadLibzGame extends React.Component {
    render() {
        const blanks = this.props.blanks.map(function(b, index) {
            return (
                <FillInTheBlank
                 id={b.id}
                 wordType={b.wordType}
                />
            );
        });

        return (
            <div>
                <ol>
                    {blanks}
                </ol>
                <div>
                    <Story template={this.props.storyTemplate} />
                </div>
            </div>
        );
    }
}


const storyTemplate = `Sam Harris once invited <<celebrity_1>> to talk on his
    podcast, where they discussed the controversy surrounding <<noun_1>>. At
    one point, they entered into a <<adjective_1>> debate, when <<celebrity_1>>
    said he believes that <<noun_2>> is a force for <<noun_3>> in peoples'
    lives. Sam's reacted <<adverb_1>> to this remark, remaining speechless
    for several seconds and gazing bemusedly at this guest.`

const blanks = [
    { id: 'celebrity_1', wordType: WordType.CELEBRITY },
    { id: 'noun_1', wordType: WordType.NOUN },
    { id: 'adjective_1', wordType: WordType.ADJECTIVE },
    { id: 'noun_2', wordType: WordType.NOUN },
    { id: 'noun_3', wordType: WordType.NOUN },
    { id: 'adverb_1', wordType: WordType.ADVERB }
];


ReactDOM.render(<MadLibzGame blanks={blanks} storyTemplate={storyTemplate} />, document.getElementById('madlibz'));
