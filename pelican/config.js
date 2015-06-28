/**
 * Created by lewiskit on 15/6/28.
 * store static configuration
 */


var config = {

    //mongodb 数据库配置
    db: {
        host: '123.57.211.52',
        port: 27017,
        user: 'pelican',
        pass: 'Pelican1221',
        db: 'pelican',
        conn_pool_size: 25

    }
};

module.exports = config;