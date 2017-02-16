//const React = require('react');
//const ReactDOM = require('react-dom');


const WordType = {
    NOUN: 0,
    VERB: 1,
    ADJECTIVE: 2,
    ADVERB: 3,
    CELEBRITY: 4,
    NONCOUNTABLE_NOUN: 5,
    PROFESSION: 6
};

/**
 * WordType metadata
 * desc:     preceded by "Enter "
 * examples: provide some examples for the user if the word type is not
 *           straightforward. don't provide examples for everything, lest
 *           the user be influenced.
 */
const WordTypeMeta = {
    0: {
        desc: 'a noun',
        examples: []
    },
    1: {
        desc: 'a verb',
        examples: []
    },
    2: {
        desc: 'an adjective',
        examples: []
    },
    3: {
        desc: 'an adverb',
        examples: []
    },
    4: {
        desc: 'the name of a celebrity',
        examples: []
    },
    5: {
        desc: 'a non-countable noun',
        examples: ['bravery', 'coffee', 'money', 'gravity']
    },
    6: {
        desc: 'a profession',
        examples: []
    },
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


class DoneBlank extends React.Component {
    render() {
        return (
            <div>{this.props.value}</div>
        );
    }
}


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

    componentDidMount() {
        this.inputElement.focus();
    }

    render() {
        let meta = WordTypeMeta[this.props.wordType];
        let desc = `Enter ${meta.desc}.`;
        let examples = ' ';
        if (meta.examples.length > 0) {
            let x = meta.examples.slice();
            x.push('etc.');
            examples = x.join(', ');
        }
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <p className="desc">{desc}</p>
                <p className="examples">{examples}</p>
                <input
                 onChange={(e) => this.handleChange(e)}
                 ref={(inputElement) => { this.inputElement = inputElement; }}
                 />
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

        // represent blanks as a queue
        let toDoBlanks = this.props.blanks.slice();
        let doneBlanks = [];
        this.state = {
            words: words,
            toDoBlanks: toDoBlanks,
            doneBlanks: doneBlanks
        };
    }

    handleSubmit(id, value) {
        if (isValidWord(value)) {
            // record value and move on
            let newWords = Object.assign({}, this.state.words, { [id]: value });
            let newToDoBlanks = this.state.toDoBlanks.slice();
            let doneBlank = newToDoBlanks.shift();
            let newDoneBlanks = this.state.doneBlanks.slice();
            newDoneBlanks.push(doneBlank);
            this.setState({
                words: newWords,
                toDoBlanks: newToDoBlanks,
                doneBlanks: newDoneBlanks
            });
        } else {
            // show an error message
        }
    }

    render() {
        const doneBlanks = this.state.doneBlanks.map(function(b) {
            return (
                <li key={b.id} className="done-blank">
                    <DoneBlank value={this.state.words[b.id]} />
                </li>
            );
        }, this);
        
        var currentBlank = (<div></div>);
        if (this.state.toDoBlanks.length > 0) {
            let blankData = this.state.toDoBlanks[0];
            currentBlank = (
                <FillInTheBlank
                 id={blankData.id}
                 wordType={blankData.wordType}
                 handleSubmit={this.handleSubmit.bind(this)}
                 key={blankData.id} // required for React to tell these apart
                />
            );
        }

        if (this.isDone()) {
            return (
                <div className="finished-story">
                    <h2>{this.props.storyTitle}</h2>
                    <p>{this.props.storyTemplate}</p>
                </div>
            );
        }

        return (
            <div>
                <div className="wordForm">{currentBlank}</div>
                <ol>
                    {doneBlanks}
                </ol>
            </div>
        );
    }

    componentDidUpdate() {
        if (!this.isDone()) {
            return;
        }

        const storyEl = document.getElementById('story');
        if (!storyEl) {
            throw new Error('Could not find story template');
        }
        Object.keys(this.state.words).forEach(function(id) {
            let value = this.state.words[id];
            if (value === null) {
                throw new Error(`Word ${id} not filled in. Can't build story.`);
            }
            let occurrences = storyEl.getElementsByClassName(id);
            // occurrences is an `HTMLCollection`
            for (let i = 0; i < occurrences.length; i++) {
                // TODO: escape this value
                occurrences[i].innerHTML = value;
            }
        }, this);
    }

    isDone() {
        return this.state.toDoBlanks.length === 0;
    }
}


// TODO: allow game to start with multiple templates that the user can choose from
const storyTitle = "On the Latest Episode of Waking Up with Sam Harris...";
const storyTemplate = (<div id="story">Sam Harris
 invited <span className="celebrity_1"></span> as a guest on his
 podcast, where they discussed the controversy
 surrounding <span className="noncountable_1"></span>. At
 one point, they entered into a <span className="adjective_1"></span> debate,
 when <span className="celebrity_1"></span> asserted
 that <span className="noun_2"></span> is a force
 for <span className="noun_3"></span> in peoples'
 lives. Sam reacted <span className="adverb_1"></span> to this remark,
 remaining <span className="adjective_2"></span> for several seconds and
 gazing <span className="adverb_2"></span> at this guest.</div>);

const blanks = [
    { id: 'celebrity_1', wordType: WordType.CELEBRITY },
    { id: 'noncountable_1', wordType: WordType.NONCOUNTABLE_NOUN },
    { id: 'adjective_1', wordType: WordType.ADJECTIVE },
    { id: 'noun_2', wordType: WordType.NONCOUNTABLE_NOUN },
    { id: 'noun_3', wordType: WordType.NONCOUNTABLE_NOUN },
    { id: 'adverb_1', wordType: WordType.ADVERB },
    { id: 'adjective_2', wordType: WordType.ADJECTIVE },
    { id: 'adverb_2', wordType: WordType.ADVERB },
];


ReactDOM.render(<MadLibzGame blanks={blanks} storyTitle={storyTitle} storyTemplate={storyTemplate} />, document.getElementById('madlibz'));
