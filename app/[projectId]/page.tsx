import ProjectPage from "./Client";

export default async function ProjectEditor({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const id = (await params).projectId;

  return <ProjectPage id={id} />;
}
