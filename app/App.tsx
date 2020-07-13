/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import SortableGridView from 'react-native-sortable-gridview';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  TouchableHighlight,
  Alert,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

declare const global: {HermesInternal: null | {}};

////////////////////////////////////////////////////////////////////////////////
// INTERVIEW NOTES: START WITH THIS COMPONENT FOR YOUR IMPLEMENTATION
////////////////////////////////////////////////////////////////////////////////

type APIGetPhotosResponse = {
  id: string;
  memberId: string;
  photos: APIPhoto[];
};

type APIPhoto = {
  id: string;
  url: string;
  width: number;
  height: number;
};

type APIPostPhotosRequest = {
  id: string;
  memberId: string;
  photos: APIPhoto[];
};

const ENDPOINT = 'http://localhost:3000/member/1/photos';
const PHOTO_URL =
  'https://cdn.dnaindia.com/sites/default/files/styles/full/public/2020/03/14/897865-bill-gates.jpg';

const App = () => {
  let [photos, setPhotos] = React.useState<APIPhoto[] | null>();

  React.useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = () => {
    fetch(ENDPOINT)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        setPhotos(data[0].photos);
      });
  };

  const onMakePrimary = (photo: APIPhoto) => {
    if (photos) {
      let newPhotos = photos.filter((item) => {
        return item.id !== photo.id;
      });
      let newPrimary = [photo, ...newPhotos];
      setPhotos(newPrimary);
    }
  };

  const removePhoto = (photo: APIPhoto) => {
    if (photos) {
      setPhotos(
        photos.filter((item) => {
          return item.id !== photo.id;
        }),
      );
    }
  };

  const createNewPhoto = () => {
    if (photos) {
      let photo = {
        id:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        url: PHOTO_URL,
        width: 796,
        height: 800,
        centerX: 366,
        centerY: 408,
      };

      fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photo),
      })
        .then((result) => {
          return result.json();
        })
        .then((data) => {
          if (photos) {
            let newPhotos = [...photos];
            newPhotos.unshift(data);
            setPhotos(newPhotos);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Button title="Add Photo" color="#000" onPress={createNewPhoto} />
        {photos && (
          <SortableGridView
            data={photos}
            numPerRow={3}
            aspectRatio={1.2}
            gapWidth={8}
            renderItem={(item: APIPhoto) => {
              return (
                <View>
                  <TouchableHighlight
                    onPress={() => {
                      onMakePrimary(item);
                    }}
                    onLongPress={() => {
                      removePhoto(item);
                    }}>
                    <Image style={styles.imageThumbnail} source={[item]} />
                  </TouchableHighlight>
                </View>
              );
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 30,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#CCCCCC',
  },
});

export default App;
