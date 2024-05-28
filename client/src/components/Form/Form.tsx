import styled from "@emotion/styled";

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
  );
};
