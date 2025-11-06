interface IThisProps {
  children?: React.ReactNode;
}

function MainTemplate({
  children,
}: IThisProps) {
  return children;
}

export default MainTemplate;
