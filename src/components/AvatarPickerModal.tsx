import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/constants';
import { Button } from './common/Button';
import { avatarOptions } from '../data/mockUser';

interface AvatarPickerModalProps {
  visible: boolean;
  currentAvatar?: string;
  onClose: () => void;
  onSelect: (uri: string) => void;
}

export function AvatarPickerModal({
  visible,
  currentAvatar,
  onClose,
  onSelect,
}: AvatarPickerModalProps) {
  const [selected, setSelected] = useState<string>(currentAvatar ?? '');

  useEffect(() => {
    if (visible) {
      setSelected(currentAvatar ?? '');
    }
  }, [visible, currentAvatar]);

  const handleSave = () => {
    onSelect(selected);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Profile Photo</Text>
            <Text style={styles.subtitle}>
              Choose a photo to use as your profile picture
            </Text>

            <View style={styles.previewContainer}>
              {selected ? (
                <Image source={{ uri: selected }} style={styles.preview} />
              ) : (
                <View style={[styles.preview, styles.previewPlaceholder]}>
                  <Text style={styles.previewPlaceholderText}>👤</Text>
                </View>
              )}
            </View>

            <View style={styles.optionsGrid}>
              {avatarOptions.map((uri) => {
                const isSelected = selected === uri;
                return (
                  <TouchableOpacity
                    key={uri}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => setSelected(uri)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri }} style={styles.optionImage} />
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.actions}>
              <View style={styles.actionButton}>
                <Button
                  title="Remove Photo"
                  onPress={() => setSelected('')}
                  variant="ghost"
                />
              </View>
              <View style={styles.actionButton}>
                <Button title="Done" onPress={handleSave} />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  sheetContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  preview: {
    width: 112,
    height: 112,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  previewPlaceholder: {
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlaceholderText: {
    fontSize: 44,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  checkText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
});
