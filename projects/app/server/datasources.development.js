module.exports = {
    db: {
        database: "refenes",
        host: "192.168.1.200",
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
    }
};
