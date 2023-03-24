import * as tf from "@tensorflow/tfjs";

export interface vaeOpts {
    originalDim: number;
    intermediateDim: number;
    latentDim: number;
}

class ZLayer extends tf.layers.Layer {
    constructor(config:any) {
      super(config);
    }
  
    computeOutputShape(inputShape:any) {
      tf.util.assert(inputShape.length === 2 && Array.isArray(inputShape[0]),
          () => `Expected exactly 2 input shapes. But got: ${inputShape}`);
      return inputShape[0];
    }
  
    call(inputs:any, kwargs:any) {
      const [zMean, zLogVar] = inputs;
      const batch = zMean.shape[0];
      const dim = zMean.shape[1];
  
      const mean = 0;
      const std = 1.0;
      // sample epsilon = N(0, I)
      const epsilon = tf.randomNormal([batch, dim], mean, std);
  
      // z = z_mean + sqrt(var) * epsilon
      return zMean.add(zLogVar.mul(0.5).exp().mul(epsilon));
    }
  
    static get className() {
      return 'ZLayer';
    }
}
tf.serialization.registerClass(ZLayer);

export function encoder(opts:vaeOpts): tf.LayersModel {
    const {originalDim, intermediateDim, latentDim} = opts;
  
    const inputs = tf.input({shape: [originalDim], name: 'encoder_input'});
    const x = tf.layers.dense({units: intermediateDim, activation: 'relu'}).apply(inputs);
    const zMean = tf.layers.dense({units: latentDim, name: 'z_mean'}).apply(x);
    const zLogVar = tf.layers.dense({units: latentDim, name: 'z_log_var'}).apply(x);
    // Tensor | Tensor[] | SymbolicTensor | SymbolicTensor[]
    const z = new ZLayer({name: 'z', outputShape: [latentDim]}).apply([zMean, zLogVar] as any);
  
    const enc = tf.model({
      inputs: inputs,
      outputs: [zMean, zLogVar, z] as any,
      name: 'encoder',
    });
  
    // console.log('Encoder Summary');
    // enc.summary();
    return enc;
}

export function decoder(opts: vaeOpts) {
    const {originalDim, intermediateDim, latentDim} = opts;
    const input = tf.input({shape: [latentDim]});
    let y = tf.layers.dense({
        units: intermediateDim,
        activation: 'relu'
    }).apply(input);
    y = tf.layers.dense({
        units: originalDim,
        activation: 'sigmoid'
    }).apply(y);
    const dec = tf.model({inputs: input, outputs: y as any});
    return dec;
}
  
export function vae(encoder:tf.LayersModel, decoder:tf.LayersModel) {
    const inputs = encoder.inputs;
    const encoderOutputs = encoder.apply(inputs) as any[];
    const encoded = encoderOutputs[2];
    const decoderOutput = decoder.apply(encoded);
    const v = tf.model({
      inputs: inputs,
      outputs: [decoderOutput, ...encoderOutputs],
      name: 'vae_mlp',
    })
    return v;
}

export function vaeLoss(inputs:any, outputs:any) {
    return tf.tidy(() => {
      const originalDim = inputs.shape[1];
      const decoderOutput = outputs[0];
      const zMean = outputs[1];
      const zLogVar = outputs[2];
  
      const reconstructionLoss =
          tf.losses.meanSquaredError(inputs, decoderOutput).mul(originalDim);
  
      let klLoss = zLogVar.add(1).sub(zMean.square()).sub(zLogVar.exp());
      klLoss = klLoss.sum(-1).mul(-0.5);
  
      return reconstructionLoss.add(klLoss).mean();
    });
}
  