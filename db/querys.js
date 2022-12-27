export const AppDataSource = new DataSource({
  type: "oracle",
  host: "my.domain.com",
  port: 1527,
  username: "atc2002",
  password: "atc2002",
  database: "ORADOC.MY.DOMAIN.COM",
  synchronize: true,
  logging: true,
  entities: [Post, Category],
  subscribers: [],
  migrations: [],
});
