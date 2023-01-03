/*export const AppDataSource = new DataSource({
  type: "oracle",
  host: "my.domain.com",
  port: 1527,
  username: "atc2002",
  password: "atc2002",
  database: "ORADOC.MY.DOMAIN.COM",
  synchronize: true,
  logging: true,
  //entities: [Post, Category],
  subscribers: [],
  migrations: [],});*/

var typeorm = require("typeorm");
const items = require("./view");

var dataSource = new typeorm.DataSource({
  type: "oracle",
  host: "my.domain.com",
  port: 1527,
  username: "ATC2002",
  password: "atc2002",
  database: "ORADOC.MY.DOMAIN.COM",
});
//console.log(`items `, items);
const getData = async () => {
  const items = await dataSource.query(`SELECT * FROM items`);
  /*.createQueryBuilder()
    .select()
    .from(items, "items");*/

  console.log(`user `, items);
};

getData().catch((e) => console.log(e));
getData().catch((e) => console.log(e));
