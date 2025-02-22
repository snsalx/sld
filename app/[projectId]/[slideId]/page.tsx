import SlideEditor from "./SlideEditor";

export default async function SlideEditorPage({
  params,
}: {
  params: Promise<{ projectId: string; slideId: string }>;
}) {
  const props = await params;

  return <SlideEditor projectId={props.projectId} slideId={props.slideId} />;
}
