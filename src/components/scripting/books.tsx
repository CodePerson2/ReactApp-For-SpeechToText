// Book objects the hold data on the 4 books to choose from in the App


// book Type imported
import {book} from '../SingleBook';

export const books: book[] = [
    {
        title: "Crime and Punishment",
        author: "Fyodor Dostoevsky",
        coverAddress: "https://upload.wikimedia.org/wikipedia/en/4/4b/Crimeandpunishmentcover.png",
        key: 1,
        keyVal: 1,
        paragraph: "The man who has a conscience suffers whilst acknowledging his sin. That is his punishment as well as prison."
    },
    {
        title: "Green Eggs and Ham",
        author: "Dr. Seuss",
        coverAddress: "https://upload.wikimedia.org/wikipedia/en/1/11/Green_Eggs_and_Ham.jpg",
        key: 2,
        keyVal: 2,
        paragraph: "WOULD YOU LIKE THEM HERE OR THERE. I WOULD NOT LIKE THEM HERE OR THERE. I WOULD NOT LIKE THEM ANYWHERE."
    },
    {
        title: "The Giving Tree",
        author: "Shel Silverstein",
        coverAddress: "https://upload.wikimedia.org/wikipedia/en/7/79/The_Giving_Tree.jpg",
        key: 3,
        keyVal: 3,
        paragraph: "And when he was tired he would sleep in her shade. And the boy loved the tree."
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        coverAddress: "https://upload.wikimedia.org/wikipedia/en/c/c4/TheAlchemist.jpg",
        key: 4,
        keyVal: 4,
        paragraph: "They are men of the desert and the men of the desert are used to dealing with omens."
    }

]