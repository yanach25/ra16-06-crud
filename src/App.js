import './App.css';
import React from "react";
import Note from "./Note";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
        this.onChangeTextArea = this.onChangeTextArea.bind(this);
        this.addPost = this.addPost.bind(this);
        this.onDeletePost = this.onDeletePost.bind(this);
        this.state = {notes: [], text: ''}
    }

    componentDidMount() {
        this.load();
    }

    load() {
        fetch(`${process.env.REACT_APP_URL}`).then(res => res.json()).then(res => {
            this.setState((prev) => ({
                ...prev,
                    notes: res,
            }));
        })
    }

    addPost() {
        const context = this.state.text;
        if (context) {
            fetch(`${process.env.REACT_APP_URL}`, {
                method: 'POST',
                body: context,
            }).then((res) => res.json()).then((res) => {
                this.setState((prev) => ({
                    text: '',
                    notes: [
                        ...prev.notes,
                        {context, id: res},
                    ],
                }));
            })
        }
    }

    onDeletePost(id) {
        fetch(`${process.env.REACT_APP_URL}${id}`, {
            method: 'DELETE',
            body: id,
        }).then(() => {
            this.setState((prev) => ({
                ...prev,
                   notes: [...prev.notes.filter((note) => note.id !== id)],
            }))
        })
    }

    onChangeTextArea(event) {
        this.setState((prev) => ({
            ...prev,
            text: event.target.value,
        }));
    }

    render() {
        const notes = this.state.notes.map((note) => <Note onDeletePost={this.onDeletePost} key={note.id} data={note}/>)
        return (
            <div className="App">
                <div className="label">
                    <span className="notes-label">Notes</span>
                    <button onClick={this.load}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="green"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
                    </button>
                </div>

                <div className="notes-wrapper">
                    {notes}
                </div>

                <div className="text-area">
                    <textarea name="" id="" cols="30" rows="8" value={this.state.text} onChange={this.onChangeTextArea} />
                    <button onClick={this.addPost}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>
        )
    }
}

export default App;
