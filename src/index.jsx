//const React = require('react');
//const ReactDOM = require('react-dom');


const WordType = {
    NOUN: 0,
    VERB: 1,
    ADJECTIVE: 2,
    ADVERB: 3,
    CELEBRITY: 4
};


// Preceded by "Please enter "
const WordTypeDesc = {
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
    constructor(props) {
        super(props);
        this.state = { value: null };
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmit(this.props.id, this.state.value);
    }

    render() {
        let desc = `Please enter ${WordTypeDesc[this.props.wordType]}.`;
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <p>{desc}</p>
                <input onChange={(e) => this.handleChange(e)} />
                <button type="submit">Submit</button>
            </form>
        );
    }
}


class MadLibzGame extends React.Component {
    constructor(props) {
        super(props);

        // initialize user's inputs to null
        let words = {};
        this.props.blanks.forEach(function(el) {
            words[el.id] = null;
        });
        this.state = { words: words };
    }

    handleSubmit(id, value) {
        if (isValidWord(value)) {
            // record value and move on
            let newWords = Object.assign({}, this.state.words, { [id]: value });
            this.setState({ words: newWords });
        } else {
            // show an error message
        }
    }

    render() {
        var that = this;
        var foundUnfilled = false;
        const blanks = this.props.blanks.map(function(b, index) {
            if (!that.state.words[b.id]) {
                foundUnfilled = true;
                return (
                    <li key={b.id}>
                        <FillInTheBlank
                         id={b.id}
                         wordType={b.wordType}
                         handleSubmit={that.handleSubmit.bind(that)}
                        />
                    </li>
                );
            } else {
                return (
                    <li key={b.id}>{that.state.words[b.id]}</li>
                );
            }
        });

        var story = '';
        if (!foundUnfilled) {
            story = this.buildStory();
        }

        return (
            <div>
                <ol>
                    {blanks}
                </ol>
                <div>{story}</div>
            </div>
        );
    }

    buildStory() {
        var story = this.props.storyTemplate;
        Object.keys(this.state.words).forEach(function(id) {
            let value = this.state.words[id];
            if (value === null) {
                throw new Error(`Not all words filled in. Can't build story.`);
            }
            story = story.replace(
                new RegExp('<<' + id + '>>', 'g'),
                `<strong>${value}</strong>`);
        }, this);
        return story;
    }
}


const storyTemplate = `Sam Harris once invited <<celebrity_1>> as a guest on his
 podcast, where they discussed the controversy surrounding <<noun_1>>. At
 one point, they entered into a <<adjective_1>> debate, when <<celebrity_1>>
 said he believes that <<noun_2>> is a force for <<noun_3>> in peoples'
 lives. Sam reacted <<adverb_1>> to this remark, remaining speechless
 for several seconds and gazing bemusedly at this guest.`;

const blanks = [
    { id: 'celebrity_1', wordType: WordType.CELEBRITY },
    { id: 'noun_1', wordType: WordType.NOUN },
    { id: 'adjective_1', wordType: WordType.ADJECTIVE },
    { id: 'noun_2', wordType: WordType.NOUN },
    { id: 'noun_3', wordType: WordType.NOUN },
    { id: 'adverb_1', wordType: WordType.ADVERB }
];


ReactDOM.render(<MadLibzGame blanks={blanks} storyTemplate={storyTemplate} />, document.getElementById('madlibz'));
