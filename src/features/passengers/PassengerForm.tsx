import { useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { AzulCivicoButton } from '../../components/AzulCivicoAction';
import { AzulCivicoField } from '../../components/AzulCivicoField';
import { colors, spacing, typography } from '../../styles/azulCivico';
import { passengerNeeds, type PassengerInput, type PassengerNeed } from './passenger';
import { getPassengerErrorMessage } from './passengerStore';

const needs = Object.keys(passengerNeeds) as PassengerNeed[];

type PassengerFormProps = {
  onSave: (input: PassengerInput) => Promise<void>;
} & (
  | { initialValues?: undefined; onDelete?: undefined }
  | { initialValues: PassengerInput; onDelete: () => Promise<void> }
);

export function PassengerForm({ initialValues, onSave, onDelete }: PassengerFormProps) {
  const isEditing = initialValues !== undefined;
  const [name, setName] = useState(initialValues?.nome ?? '');
  const [need, setNeed] = useState<PassengerNeed | null>(initialValues?.tipoNecessidade ?? null);
  const [emergencyContact, setEmergencyContact] = useState(initialValues?.contatoEmergencia ?? '');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [operation, setOperation] = useState<'save' | 'delete' | null>(null);
  const operationInProgress = useRef(false);
  const [requestError, setRequestError] = useState<string>();
  const busy = operation !== null;

  const nameError = name.trim() ? undefined : 'Informe o nome do passageiro.';
  const needError = need ? undefined : 'Selecione o tipo de necessidade.';
  const contactError = emergencyContact.trim() ? undefined : 'Informe o contato de emergência.';
  const consentError = isEditing || consent ? undefined : 'Confirme o consentimento para continuar.';

  async function run(kind: 'save' | 'delete', action: () => Promise<void>, errorMessage: string) {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setOperation(kind);
    setRequestError(undefined);
    Keyboard.dismiss();

    try {
      await action();
    } catch (error) {
      setRequestError(getPassengerErrorMessage(error, errorMessage));
    } finally {
      operationInProgress.current = false;
      setOperation(null);
    }
  }

  function submit() {
    setSubmitted(true);
    setRequestError(undefined);
    if (nameError || !need || contactError || consentError) return;

    const input = { nome: name.trim(), tipoNecessidade: need, contatoEmergencia: emergencyContact.trim() };
    const errorMessage = isEditing
      ? 'Não foi possível salvar as alterações. Tente novamente.'
      : 'Não foi possível cadastrar o passageiro. Tente novamente.';

    void run('save', () => onSave(input), errorMessage);
  }

  function confirmDeletion() {
    if (!initialValues || !onDelete || operationInProgress.current) return;

    Keyboard.dismiss();
    Alert.alert(
      'Excluir passageiro?',
      `O cadastro de ${initialValues.nome} será excluído da sua conta. Esta ação é permanente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void run('delete', onDelete, 'Não foi possível excluir o passageiro. Tente novamente.'),
        },
      ],
    );
  }

  return (
    <View style={styles.form}>
      <AzulCivicoField
        label="Nome do passageiro"
        autoCapitalize="words"
        maxLength={120}
        editable={!busy}
        value={name}
        onChangeText={(value) => {
          setName(value);
          setRequestError(undefined);
        }}
        error={submitted ? nameError : undefined}
      />
      <View style={styles.needGroup}>
        <Text style={styles.label}>Tipo de necessidade</Text>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {needs.map((value) => {
            const checked = need === value;
            const label = passengerNeeds[value];

            return (
              <Pressable
                key={value}
                accessibilityLabel={label}
                accessibilityRole="radio"
                accessibilityState={{ checked, disabled: busy }}
                disabled={busy}
                onPress={() => {
                  setNeed(value);
                  setRequestError(undefined);
                }}
                style={({ pressed }) => [
                  styles.option,
                  checked && styles.selectedOption,
                  pressed && styles.pressedOption,
                ]}
              >
                <View accessible={false} style={[styles.radio, checked && styles.selectedRadio]}>
                  {checked && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionLabel}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        {submitted && needError && (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {needError}
          </Text>
        )}
      </View>
      <AzulCivicoField
        label="Contato de emergência"
        keyboardType="phone-pad"
        maxLength={40}
        editable={!busy}
        value={emergencyContact}
        onChangeText={(value) => {
          setEmergencyContact(value);
          setRequestError(undefined);
        }}
        error={submitted ? contactError : undefined}
      />
      {!isEditing && (
        <View style={styles.needGroup}>
          <Text style={styles.label}>Consentimento</Text>
          <Text style={styles.note}>
            O Parada Certa armazena nome, tipo de necessidade e contato de emergência na sua conta para organizar o embarque assistido.
          </Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: consent, disabled: busy }}
            disabled={busy}
            onPress={() => {
              setConsent((current) => !current);
              setRequestError(undefined);
            }}
            style={({ pressed }) => [
              styles.option,
              consent && styles.selectedOption,
              pressed && styles.pressedOption,
            ]}
          >
            <View accessible={false} style={[styles.checkbox, consent && styles.selectedRadio]}>
              {consent && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.optionLabel}>Confirmo que tenho autorização para cadastrar esses dados.</Text>
          </Pressable>
          {submitted && consentError && (
            <Text accessibilityLiveRegion="polite" style={styles.error}>{consentError}</Text>
          )}
        </View>
      )}
      <AzulCivicoButton
        label={isEditing ? 'Salvar alterações' : 'Cadastrar passageiro'}
        onPress={submit}
        busy={operation === 'save'}
        disabled={busy}
      />
      {isEditing && (
        <AzulCivicoButton
          label="Excluir passageiro"
          onPress={confirmDeletion}
          busy={operation === 'delete'}
          disabled={busy}
          variant="danger"
        />
      )}
      {requestError && (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.error}>
          {requestError}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.controlGap,
  },
  needGroup: {
    gap: 8,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.controlGap,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.field,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  pressedOption: {
    opacity: 0.86,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: colors.primary,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.control,
    color: colors.text,
  },
  optionLabel: {
    ...typography.body,
    flexShrink: 1,
    color: colors.text,
  },
  note: {
    ...typography.message,
    color: colors.text,
  },
  error: {
    ...typography.message,
    color: colors.error,
  },
});
