// testing actions
const testPost = (req, res) => {
    return res.status(200).json({
        message: 'Message sent from Post controller',
    });
    }


    // Export the test function
module.exports = {
    testPost,
};