const prisma = require("../config/prisma");

const books = [
    { title: "Harry Potter", author: "JK Rowling", stock: 10 },
    { title: "Lord of the Rings", author: "JRR Tolkien", stock: 5 },
    { title: "The Hobbit", author: "JRR Tolkien", stock: 0 },
];

const members = [
    { name: "John Doe" },
    { name: "Jane Doe" },
    { name: "John Smith" },
];

const borrowings = [
    {
        borrow_date: new Date(),
        return_date: new Date(),
        member_id: 1,
        book_id: 1,
    },
    {
        borrow_date: new Date(),
        return_date: new Date(),
        member_id: 2,
        book_id: 2,
    },
    {
        borrow_date: new Date(),
        member_id: 3,
        book_id: 3,
    },
];

async function main() {
    for (const book of books) {
        await prisma.book.create({ data: book });
    }

    for (const member of members) {
        await prisma.member.create({ data: member });
    }

    for (const borrowing of borrowings) {
        await prisma.borrowing.create({ data: borrowing });
    }
}

main();
