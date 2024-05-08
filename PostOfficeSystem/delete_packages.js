// delete_packages.js
module.exports = function(req, res, connection) {
    // Extract the package ID from the URL path /customer_packages/:packageId
    const packageId = req.url.split('/')[2];

    // Adjust the query to match 'just created' status
    const query = 'DELETE FROM packages WHERE packages_id = ? AND package_status = "just created"';
    
    connection.query(query, [packageId], (err, result) => {
        if (err) {
            console.error('Error deleting the package: ', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error deleting the package' }));
            return;
        }
        if (result.affectedRows === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Package not found or not in a deletable status' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Package deleted successfully' }));
    });
};