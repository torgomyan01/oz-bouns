interface IThisProps {
  children?: React.ReactNode;
}

function MainTemplate({
  children,
}: IThisProps) {
  return (
    <div className="container pt-6! bg-[#e2f4ff]!">
      {children}
    </div>
  );
}

export default MainTemplate;
