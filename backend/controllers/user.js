// testing actions
const testUser = (req, res) => {
    return res.status(200).json({
        message: 'Message sent from User controller',
    });
    }


    // Export the test function
module.exports = {
    testUser,
};