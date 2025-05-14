import { generateXML } from "@/lib/gemini-utils";
import PageContent from "./page-content";
// export default
export default async function TestPage() {
  // generando string xml con información relacionada con la base de datos
  const xmlString = await generateXML();
  // Page
  return <PageContent xmlString={xmlString} />;
}
