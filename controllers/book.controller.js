const prisma = require("../config/prisma");

const checkBook = async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            where: {
                stock: {
                    gt: 0,
                },
            },
        });
        return res.json({
            success: true,
            status: 200,
            message: "data fetched successfully",
            data: books,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message,
        });
    }
};

module.exports = {
    checkBook,
};
