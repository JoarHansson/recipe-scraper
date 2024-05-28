import styled from "@emotion/styled";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: center;
`;

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #f5f5f5;
  border-radius: 1.5rem;
  padding: 2rem 0;
  max-width: 500px;
  width: 90%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const InputField = styled.input`
  width: 200px;
  text-align: center;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  &:hover {
    border-color: #1a1a1a;
    transition: border-color 0.3s;
  }
`;

type Props = {
  url: string | undefined;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

export const Form = ({ url, handleInputChange, handleSubmit }: Props) => {
  return (
    <FormWrapper>
      <FormElement onSubmit={handleSubmit}>
        <InputWrapper>
          <label htmlFor="urlInput">Paste your url here:</label>
          <InputField
            value={url || ""}
            onChange={handleInputChange}
            id="urlInput"
            type="url"
            placeholder="https://www.recipe.com"
          />
        </InputWrapper>
        <button type="submit">Declutter</button>
      </FormElement>
    </FormWrapper>
  );
};
