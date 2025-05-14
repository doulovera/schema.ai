import { generateXML } from "./XmlMock";
import PageContent from "./PageContent";
// export default
export default async function TestPage() {
  // generando string xml con información relacionada con la base de datos
  const xmlString = await generateXML();
  // Page
  return <PageContent xmlString={xmlString} />;
}
