import { Image } from "expo-image";
import { View } from "react-native";
import { fallbackAvatar, profileRoom } from "@/theme/pixelAssets";

type Props = {
  id?: string;
  name?: string;
  imageUrl?: string;
};

/** Layers a transparent pixel avatar over a profile-specific room scene. */
export function AvatarScene({ id, name, imageUrl }: Props) {
  if (imageUrl) return <Image source={{ uri: imageUrl }} contentFit="cover" style={{ width: "100%", height: "100%" }} />;

  return <View className="h-full w-full overflow-hidden">
    <Image source={profileRoom(id, name)} contentFit="cover" style={{ width: "100%", height: "100%" }} />
    <View className="absolute bottom-0 left-[15%] h-[94%] w-[70%] overflow-hidden">
      <Image
        source={fallbackAvatar(id, name)}
        contentFit="contain"
        style={{ position: "absolute", bottom: -8, width: "100%", height: "108%" }}
      />
    </View>
  </View>;
}
