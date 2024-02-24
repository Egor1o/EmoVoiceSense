import styled from "styled-components";
import AudioRecorder from "./AudioRecorder.tsx";

type Props = {
    onPress: () => void;
};
const RecordingButton = (props : Props) => {
    const press = props.onPress
    press()
return (<ButtonContainer>
    <AudioRecorder />
</ButtonContainer>)
}

const ButtonContainer = styled.div`
    color: #747bff;
`



export default RecordingButton