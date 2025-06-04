import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function formatCPF(cpf) {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function PerfilScreen({ route, navigation }) {
  const { cpf, email: emailInicial, senha: senhaInicial } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [email, setEmail] = useState(emailInicial);
  const [senha, setSenha] = useState(senhaInicial);
  const [tempEmail, setTempEmail] = useState(emailInicial);
  const [tempSenha, setTempSenha] = useState(senhaInicial);

  const handleSave = () => {
    setEmail(tempEmail);
    setSenha(tempSenha);
    setModalVisible(false);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled" >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#3a3a3a" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setHelpModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="help-circle-outline" size={20} color="#5B3E96" />
              <Text style={styles.helpText}>Fale Conosco</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Perfil do Usuário</Text>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>CPF (não editável)</Text>
              <View style={[styles.box, styles.boxDisabled]}>
                <Text style={[styles.value, styles.valueDisabled]}>
                  {formatCPF(cpf)}
                </Text>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.box}>
                <Text style={styles.value}>{email}</Text>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.box}>
                <Text style={styles.value}>{'*'.repeat(senha.length)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Dados</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={tempEmail}
              onChangeText={setTempEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Digite seu email"
              placeholderTextColor="#bbb"
              textContentType="emailAddress"
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Senha</Text>
            <TextInput
              style={styles.modalInput}
              value={tempSenha}
              onChangeText={setTempSenha}
              secureTextEntry
              placeholder="Digite sua senha"
              placeholderTextColor="#bbb"
              textContentType="password"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.save]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="fade"
        transparent
        visible={helpModalVisible}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.helpModalBox}>
            <Text style={styles.helpModalTitle}>Precisa de Ajuda?</Text>
            <Text style={styles.helpModalText}>
              Está com problemas para editar seu perfil?
            </Text>
            <Text style={styles.helpModalText}>
              Entre em contato conosco pelo email:
            </Text>
            <Text style={[styles.helpModalText, styles.emailText]}>
              suporte@findmypet.com
            </Text>

            <TouchableOpacity
              style={styles.helpModalButton}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={styles.helpModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  container: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 6,
  },
  backText: {
    fontSize: 16,
    color: '#3a3a3a',
    marginLeft: 6,
    fontWeight: '600',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 6,
  },
  helpText: {
    fontSize: 14,
    color: '#5B3E96',
    marginLeft: 6,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2e2e2e',
    marginBottom: 30,
  },
  infoGroup: {
    marginBottom: 22,
  },
  label: {
    fontWeight: '700',
    fontSize: 17,
    color: '#555',
    marginBottom: 6,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  boxDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  valueDisabled: {
    color: '#999',
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#5B3E96',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B3E96',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(40,40,40,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#5B3E96',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#5B3E96',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#f9f9f9',
    marginTop: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#ddd',
  },
  save: {
    backgroundColor: '#5B3E96',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  helpModalBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 18,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 15,
  },
  helpModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#5B3E96',
    marginBottom: 20,
  },
  helpModalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#5B3E96',
  },
  helpModalButton: {
    marginTop: 25,
    backgroundColor: '#5B3E96',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  helpModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
