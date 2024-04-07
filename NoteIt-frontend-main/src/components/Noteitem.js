//for showing each of the noteItem
import React, { useContext } from "react";
import noteContext from "../context/notes/NoteContext"

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const {deleteNote} = context;
    
    const { note, updateNote } = props;


    return (
        <div>
            <div className="col-md-3">
                <div className="card my-3">
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <p className="card-text">{note.description}</p>
                        <p className="card-text text-light bg-dark">{note.tag}</p>
                        <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note); props.showAlert("Updated note successfully", "success")}} ></i>
                        <i className="fa-solid fa-trash mx-3"
                        onClick={()=>{deleteNote(note._id); props.showAlert("Note deleted sucessfully", "success")}}></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Noteitem;