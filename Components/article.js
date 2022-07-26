import { Container, Row, Card, Text } from "@nextui-org/react";
import Dashboard from "../Components/Dashboard";
import DataTable from "../Components/DataTables";

export default function Article() {
  return (
    <Container xl>
      <Card>
        <p>Welcom To container </p>
        <DataTable />
      </Card>
    </Container>
  );
}
