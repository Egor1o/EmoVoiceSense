from librosa.feature import melspectrogram, mfcc, tonnetz, spectral_contrast, chroma_stft
from librosa.effects import harmonic
from librosa import stft
import numpy as np

def extract_mel(audio, rate=22050.0):
  spectogram_array = melspectrogram(y=audio, sr=rate)
  spectogram_mean = np.mean(spectogram_array, axis=1)
  return spectogram_mean

def extract_mfcc(audio, rate=22050.0):
  mfc_coefficients = mfcc(y=audio, sr=rate, n_mfcc=50)
  mfcc_mean = np.mean(mfc_coefficients, axis=1)
  return mfcc_mean

def extract_contrast(audio, rate=22050.0):
  contrast = spectral_contrast(y=audio, sr=rate)
  return np.mean(contrast, axis=1)

def extract_chroma(audio, rate=22050.0):
  S = np.abs(stft(audio))
  chrom = chroma_stft(S=S, sr=rate)
  return np.mean(chrom, axis=1)


def extract_tonnetz_features(audio, rate=22050.0):
  array = tonnetz(y=harmonic(audio), sr=rate, fmin=65.4, n_octaves=4, bins_per_octave=24)
  mean = np.mean(array, axis=1)
  return mean

def extract_features(audio, sr=22050.0):
  return np.hstack((extract_mel(audio, rate=sr), extract_mfcc(audio, rate=sr), extract_contrast(audio, rate=sr), extract_chroma(audio, rate=sr), extract_tonnetz_features(audio, rate=sr)))