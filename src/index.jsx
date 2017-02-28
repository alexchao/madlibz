//const React = require('react');
//const ReactDOM = require('react-dom');


const WordType = {
    NOUN: 0,
    VERB: 1,
    ADJECTIVE: 2,
    ADVERB: 3,
    CELEBRITY: 4,
    NONCOUNTABLE_NOUN: 5,
    PROFESSION: 6,
    ARTICLE_OF_CLOTHING: 7
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
    7: {
        desc: 'an article of clothing',
        examples: []
    }
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


class MadLibzGameRound extends React.Component {

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
            // occurrences is an `HTMLCollection`, which is not exactly
            // an array
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


class MadLibzGame extends React.Component {

    constructor(props) {
        super(props);

        // make it easier to access each game datum
        this.allGameData = {};
        this.props.gameData.forEach(function(datum) {
            this.allGameData[datum.id] = datum;
        }, this);

        this.state = {
            currentGameId: null,
        };
    }

    handleMenuClick(e) {
        e.preventDefault();
        this.setState({ currentGameId: e.target.dataset.gameId });
    }

    render() {
        if (this.state.currentGameId !== null) {
            let gameData = this.allGameData[this.state.currentGameId];
            return (
                <MadLibzGameRound
                 blanks={gameData.blanks}
                 storyTitle={gameData.storyTitle}
                 storyTemplate={gameData.storyTemplate}
                />
            );
        }

        let gameLinks = this.props.gameData.map(function(datum) {
            return (
                <li key={datum.id} className="game-link">
                    <a
                     href="#"
                     data-game-id={datum.id}
                     onClick={(e) => {this.handleMenuClick(e)}}
                     >{datum.shortTitle}</a>
                </li>
            );
        }, this);

        return (
            <div className="game-list-container">
                <p>Pick a story...</p>
                <ul className="game-list">
                    {gameLinks}
                </ul>
            </div>
        );
    }

}

const GAME_DATA = [

    { // 1. wakingup
        id: 'wakingup',
        shortTitle: "Waking up...",
        storyTitle: "On the Latest Episode of Waking Up with Sam Harris...",
        storyTemplate: (<div id="story">Sam Harris
 invited <span className="celebrity_1"></span> as a guest on his
 podcast, where they discussed the controversy
 surrounding <span className="noncountable_1"></span>. At
 one point, they entered into a <span className="adjective_1"></span> debate,
 when <span className="celebrity_1"></span> asserted
 that <span className="noun_2"></span> is a force
 for <span className="noun_3"></span> in peoples'
 lives. Sam reacted <span className="adverb_1"></span> to this remark,
 remaining <span className="adjective_2"></span> for several seconds and
 gazing <span className="adverb_2"></span> at this guest.</div>),
        blanks: [
            { id: 'celebrity_1', wordType: WordType.CELEBRITY },
            { id: 'noncountable_1', wordType: WordType.NONCOUNTABLE_NOUN },
            { id: 'adjective_1', wordType: WordType.ADJECTIVE },
            { id: 'noun_2', wordType: WordType.NONCOUNTABLE_NOUN },
            { id: 'noun_3', wordType: WordType.NONCOUNTABLE_NOUN },
            { id: 'adverb_1', wordType: WordType.ADVERB },
            { id: 'adjective_2', wordType: WordType.ADJECTIVE },
            { id: 'adverb_2', wordType: WordType.ADVERB }
        ]
    },

    { // 2. arnold
        id: 'arnold',
        shortTitle: "At the Beach",
        storyTitle: "The Governator goes to the beach...",
        storyTemplate: (<div id="story">One hot, summer day,
 Arnold Schwarzenegger was feeling especially <span className="adj_1"></span>,
 so he decided to take a trip to the beach. He put on his
 swimming <span className="clothes_1"></span>, grabbed
 his <span className="noun_1"></span>, and jumped into his car.</div>),
        blanks: [
            { id: 'adj_1', wordType: WordType.ADJECTIVE },
            { id: 'clothes_1', wordType: WordType.ARTICLE_OF_CLOTHING },
            { id: 'noun_1', wordType: WordType.NOUN }
        ]
    }

];


ReactDOM.render(<MadLibzGame gameData={GAME_DATA} />, document.getElementById('madlibz'));
