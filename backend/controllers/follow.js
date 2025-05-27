// testing actions
const testFollow = (req, res) => {
    return res.status(200).json({
        message: 'Message sent from Follow controller',
    });
    }


    // Export the test function
module.exports = {
    testFollow,
};