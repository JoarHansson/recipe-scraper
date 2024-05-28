import styled from "@emotion/styled";

type Props = {
  errorMessage: string;
};

let Container = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
});

const ErrorMessage = styled.p({
  textAlign: "center",
});

export const ErrorContainer = ({ errorMessage }: Props) => {
  return (
    <Container>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </Container>
  );
};
