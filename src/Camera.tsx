import { useState, useEffect, useRef,  } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions, CameraType, CameraMode } from 'expo-camera';
import {MaterialIcons} from "@expo/vector-icons";
import * as MedialLibrary from "expo-media-library";

type FlashMode = "off" | "on" | "auto";

export default function App() {

  const [isSaving, setIsSaving] = useState(false);

// Guarda o endereço da última foto tirada
const [fotoUri, setFotoUri] = useState<string | null>(null);
  //Permissões do dispositivo
  // A expo fornece hooks que retornam statusAtual e função para solicitar

  //Permissão de acesso a camera
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  //Permissão microfone
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  //permissão para acessar e salvar arquivos na galeria
  //writeOnly: true solicita apenas permissão de escrita (salvar)
const [mediaPermission, requestMediaPermission] = MedialLibrary.usePermissions({writeOnly: true});

// facing controla se estamos usando a camera frontal ou traseira
const [facing, setfacing] = useState<CameraType>("back");

//cameraMode alterna entre foto ou video
const [CameraMode, setCameraMode] = useState<CameraMode>("picture");

//flag pra saber se a gravação esta ativa no momento
const [isRecording, setIsRecording] = useState(false);

//flashMode armazena o status do flash
const [FlashMode, setFlashMode] = useState<FlashMode>("off");

// REFERENCIA DA CAMERA
//useRef cria a ligação direta com o componente CameraView e nos permite atraves do .current
//chamar os metodos navitos takePictureAsync(), recordAsync e stopRecording()
const cameraRef = useRef<CameraView>(null);

//Solicitação inicial das permissões
useEffect(() => {
  (async() => {
    if(!cameraPermission?.granted) await requestCameraPermission();
    if(!micPermission?.granted) await requestMicPermission();
    if(!mediaPermission?.granted) await requestMediaPermission();
  })();
}, [])

//Inverter entre camera front e traseira
const toggleCameraFacing = () => {
  setfacing((current) => (current === "back" ? "front" : "back"));
}

//alterna ciclicamente o modo do flash: Desligado, Ligado, Automatico
const toggleFlashMode = () => {
  setFlashMode((current) => {
    if(current === "off") return "on";
    if(current === "on") return "auto";
    return "off"
    
  })
}

//Retorna o nome do icone
const getFlashIcon = () => {
  if(FlashMode === "on") return "flash-on"
  if(FlashMode === "auto") return "flash-auto"
  return "flash-off"
}

//Muda o modo camera (foto ou video)
const handleCameraMode = (mode: CameraMode) => {
  setCameraMode(mode);

  if (isRecording) {
    setIsRecording(false);
    cameraRef.current?.stopRecording();
  }
}

const takeMedia = async () => {
  //Se a referencia da camera não estiver pronta ou já estiver salvando algo, ignore o toque 
  if(!cameraRef.current || isSaving) return;

  try {
    if(CameraMode === "picture") {
      setIsSaving(true);

      const foto = await cameraRef.current.takePictureAsync({quality: 1, skipProcessing: false})

      if(foto?.uri) {
        setFotoUri(foto.uri);
        let hasPermission = mediaPermission?.granted

        if (!hasPermission) {
          const permissionResult = await requestMediaPermission();
          hasPermission = permissionResult.granted;
        }

        if (!hasPermission) {
          Alert.alert("Aviso", "Permissão negada para salvar a foto da galeria.")

          setIsSaving(false);
          return;
        }

        await MedialLibrary.createAssetAsync(foto.uri);
        Alert.alert("Sucesso", "Foto salva na galeria");
      }
      setIsSaving(false)
    }else{
      if (isRecording) {
        cameraRef.current.stopRecording();
        return;
      }

      setIsRecording(true);

      const video = await cameraRef.current.recordAsync();
      setIsRecording(false);

      if(video?.uri) {
        await MedialLibrary.saveToLibraryAsync(video.uri);
        Alert.alert("Sucesso", "Video salvo na galeria!");
      }
    }
  } catch (error) {
    setIsSaving(false);
    setIsRecording(false);
    Alert.alert("Erro", "Não foi possivel capturar ou salvar a midia.")
  }
}

//RENDERIZAÇÃO CONDICIONAL
if(!cameraPermission) {
  return <View style={styles.container} />
}

if (!cameraPermission.granted) {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.permissionText}>
        Precisamos de permissão para acessar a camera
      </Text>
      <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
        <Text style={styles.permissionButtonText}>Conceder permissão </Text>
      </TouchableOpacity>
    </View>
  )
}
  
  return (
  <View style={styles.container}>

    {fotoUri ? (
      // Exibe a foto tirada
      <View style={styles.previewContainer}>

        <Image
          source={{ uri: fotoUri }}
          style={styles.previewImage}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.newPhotoButton}
          onPress={() => setFotoUri(null)}
        >
          <Text style={styles.newPhotoButtonText}>
            Tirar outra foto
          </Text>
        </TouchableOpacity>

      </View>

    ) : (
      // Exibe a câmera normalmente
      <>
        <CameraView
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          facing={facing}
          flash={FlashMode}
          mode={CameraMode}
        />

        <View style={styles.overlayContainer}>
          <View style={styles.topContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleFlashMode}>
              <MaterialIcons
                name={getFlashIcon()}
                size={30}
                color={FlashMode !== "off" ? "#FFD700" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="cameraswitch" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.controlsContainer}>
              <View style={styles.modeSelector}>
                <TouchableOpacity onPress={() => handleCameraMode("picture")}>
                  <Text style={[styles.modeText, CameraMode === "picture" && styles.modeTextSelected]}>
                    foto
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleCameraMode("video")}>
                  <Text style={[styles.modeText, CameraMode === "video" && styles.modeTextSelected]}>
                    Video
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.captureButton,
                  isRecording && styles.captureButtonRecording,
                ]}
                onPress={takeMedia}
                disabled={isSaving}
              >
                <View
                  style={[
                    styles.captureInner,
                    isRecording && styles.captureInnerRecording,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    )}

    <StatusBar style="auto" />
  </View>
);
}
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 25,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 40,
  },
  controlsContainer: {
    alignItems: "center",
  },
  modeSelector: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modeText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  modeTextSelected: {
    color: "white",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonRecording: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "white",
  },
  captureInnerRecording: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "red",
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  previewContainer: {
  flex: 1,
  backgroundColor: "black",
  justifyContent: "center",
  alignItems: "center",
},

previewImage: {
  width: "100%",
  height: "80%",
},

newPhotoButton: {
  backgroundColor: "#007AFF",
  paddingHorizontal: 25,
  paddingVertical: 14,
  borderRadius: 10,
  marginTop: 20,
},

newPhotoButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},
});

