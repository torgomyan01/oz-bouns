interface IThisProps {
  children?: React.ReactNode;
}

function MainTemplate({
  children,
}: IThisProps) {
  return (
    <div className="container !pt-[70px]">
      {children}
    </div>
  );
}

export default MainTemplate;
