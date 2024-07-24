const prisma = require("../config/prisma");

const getUser = async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            include: {
                borrowings: {
                    where: {
                        return_date: null,
                    },
                },
            },
        });

        const data = members.map((member) => {
            return {
                ...member,
                borrowings_count: member.borrowings.length,
            };
        });

        return res.json({
            success: true,
            status: 200,
            message: "data fetched successfully",
            data,
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
    getUser,
};
