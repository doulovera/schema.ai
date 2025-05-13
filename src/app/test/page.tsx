// app/testPage.jsx (Server Component)
import Diagrama from "./Diagrama";
import { generateXML } from "./XmlMock";
// xml to json conversion

export default async function testPage() {
  const xmlString = await generateXML();
  return <Diagrama xmlString={xmlString} />;
}
