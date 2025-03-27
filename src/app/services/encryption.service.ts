import { Injectable } from '@angular/core';
import * as forge from 'node-forge';
import { privateKey, publicKey } from '../shared/constants';

@Injectable({
  providedIn: 'root',
})

export class EncryptionService {
  encrypt(valueToEncrypt: string): string {
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    return btoa(rsa.encrypt(valueToEncrypt.toString()));
  }
  
  decrypt(valueToDecrypt: string): string {
    const encryptedBytes = forge.util.decode64(valueToDecrypt);
    const rsa = forge.pki.privateKeyFromPem(privateKey);
    return rsa.decrypt(encryptedBytes.toString(), 'RSAES-PKCS1-V1_5');
  }
}
