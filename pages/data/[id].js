//  import DataTable from "../../Components/DataTables";
import DataTablesA from "../../Components/DataTable.js";
import { useRouter } from "next/router";

export default function runDataTables({ allPokemons }) {
  const router = useRouter();

  console.log(`allPokemons65gsdhsdfghjm,ertj4frg      `, allPokemons);
  const { id } = router.query;
  console.log(`router.query`);
  console.log(id);

  // return <DataTable query={id} />;
  return <DataTablesA query={id} />;
}
