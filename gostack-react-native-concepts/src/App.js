import api from './services/api';
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  const fetchRepositories = async () => {
    try {
      const response = (await api.get('repositories')).data;

      setRepositories(response);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleLikeRepository = async (id) => {
    try {
      const repository = (await api.post(`repositories/${id}/like`)).data;

      const repositoryIndex = repositories.findIndex((repository) => {
        return id === repository.id;
      });

      repositories[repositoryIndex] = repository;

      setRepositories([...repositories]);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          style={styles.repositoryContainer}
          renderItem={({ item: repository }) => (
            <>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                <Text style={styles.tech}>{repository.techs}</Text>
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes > 1
                    ? `${repository.likes} curtidas`
                    : `${repository.likes} curtida`}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </>
          )}
          keyExtractor={(repository) => repository.id}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
  },
});
