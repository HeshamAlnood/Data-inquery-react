//  import DataTable from "../../Components/DataTables";
import DataTablesA from "../../Components/DataTable.js";
import { useRouter } from "next/router";

//const router = useRouter();
export default function RunDataTables({ data }) {
  const router = useRouter();

  const { id } = router.query;
  /*console.log(`router.query`);
  console.log(id);*/

  // return <DataTable query={id} />;
  return <DataTablesA query={id} data={data} />;
}

export async function getServerSideProps(context) {
  console.log(`context `, context.params.id);
  let rsp = await fetch(
    `http://192.168.0.159:3001/dbData?inquery=${context.params.id}`
  );

  let data = await rsp.json();

  return {
    props: { data: data }, // will be passed to the page component as props
  };
}
