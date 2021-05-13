import React from 'react'

export type book = {
    title: string;
    author: string;
    coverAddress: string;
    key: number;
    keyVal: number;
    paragraph: string;
};

type bookProp = {
    book: book,
    transition: Function
}
export type books = book[];

const SingleBook = ({book, transition}: bookProp) => {

    return (
        <div className="bookCont-Each" onClick={() => {transition('Reading', book.keyVal)}}>
            <img alt="book cover" src={book.coverAddress}></img>
            
        </div>
    )
}

export default SingleBook;
