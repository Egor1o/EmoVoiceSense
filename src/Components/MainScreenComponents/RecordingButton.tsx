import styled from "styled-components";

type Props = {
    onPress: () => void;
};
const RecordingButton = (props : Props) => {
return (<ButtonContainer>
    <RecordButton onClick={props.onPress}/>
</ButtonContainer>)
}

const ButtonContainer = styled.div`
    color: #747bff;
`
const RecordButton = styled.button`
    background-color: #646cff;
`


export default RecordingButton