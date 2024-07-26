const prisma = require("../config/prisma");

const borrowBook = async (req, res) => {
    try {
        // get user input
        const input = req.body;

        // validate input
        if (!input.member_id || !input.book_id) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Missing member_id or book_id",
            });
        }

        // check member_id and book_id data type
        if (
            typeof input.member_id != "number" ||
            typeof input.book_id != "number"
        ) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid member_id or book_id data type",
            });
        }

        // check member exist
        const member = await prisma.member.findFirst({
            where: {
                id: input.member_id,
            },
            select: {
                penalty_date: true,
                borrowings: true,
            },
        });
        if (!member) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Member not found",
            });
        }

        // check book availability
        const book = await prisma.book.findFirst({
            where: {
                id: input.book_id,
                stock: {
                    gt: 0,
                },
            },
        });
        if (!book) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Book is not available",
            });
        }

        // check is member borrowing this book
        const borrowing = await prisma.borrowing.findFirst({
            where: {
                member_id: input.member_id,
                book_id: input.book_id,
                return_date: null,
            },
        });
        if (borrowing) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Member is already borrowing this book",
            });
        }

        // check member borrowing limit
        const borrows = member.borrowings.filter((borrow) => {
            return borrow.return_date == null;
        });
        if (borrows.length >= 2) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Member borrowing limit reached",
            });
        }

        // check member penalty date
        const currentDate = new Date();
        if (member.penalty_date && member.penalty_date > currentDate) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Member is being penalized",
            });
        }

        // update book stock
        await prisma.book.update({
            where: {
                id: input.book_id,
            },
            data: {
                stock: book.stock - 1,
            },
        });

        // add borrowing list
        await prisma.borrowing.create({
            data: {
                member_id: input.member_id,
                book_id: input.book_id,
                borrow_date: currentDate,
                return_date: null,
            },
        });

        return res.json({
            success: true,
            status: 200,
            message: "Book borrowed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message,
        });
    }
};

const returnBook = async (req, res) => {
    try {
        // get user input
        const input = req.body;

        // validate input
        if (!input.member_id || !input.book_id) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Missing member_id or book_id",
            });
        }

        // check member_id and book_id data type
        if (
            typeof input.member_id != "number" ||
            typeof input.book_id != "number"
        ) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Invalid member_id or book_id data type",
            });
        }

        // check member exist
        const member = await prisma.member.findFirst({
            where: {
                id: input.member_id,
            },
            select: {
                penalty_date: true,
                borrowings: true,
            },
        });
        if (!member) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Member not found",
            });
        }

        // check book exist in member borrowed books
        const borrowed = member.borrowings.find((borrow) => {
            return (
                borrow.book_id == input.book_id && borrow.return_date == null
            );
        });
        if (!borrowed) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "Book is not being borrowed",
            });
        }

        let message = "Book returned successfully";

        // check penalty date
        const currentDate = new Date();
        const returnDate = new Date(
            borrowed.borrow_date.setDate(borrowed.borrow_date.getDate() + 7)
        );
        if (returnDate < currentDate) {
            const penalty_date = new Date(currentDate.getDate() + 7);
            await prisma.member.update({
                where: {
                    id: input.member_id,
                },
                data: {
                    penalty_date,
                },
            });
            message = "Book returned late";
        }

        // update book stock
        await prisma.book.update({
            where: {
                id: input.book_id,
            },
            data: {
                stock: {
                    increment: 1,
                },
            },
        });

        // update member borrowed books
        await prisma.borrowing.update({
            where: {
                id: borrowed.id,
            },
            data: {
                return_date: currentDate,
            },
        });

        return res.json({
            success: true,
            status: 200,
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message,
        });
    }
};

module.exports = { borrowBook, returnBook };
