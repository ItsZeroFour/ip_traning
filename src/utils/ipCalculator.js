import ipaddr from 'ipaddr.js';

export function calculateSubnet(ipStr, maskStr) {
  try {
    const ip = ipaddr.parse(ipStr);
    const mask = ipaddr.parse(maskStr);
    if (!ip.isIPv4() || !mask.isIPv4()) {
      throw new Error('Только IPv4 поддерживается');
    }
    // const network = ip.toIPv4Address().toIPv4MappedAddress
    //   ? ip
    //   : ip;
    const subnet = ipaddr.IPv4.subnet(ipStr, maskStr);
    
    return {
      networkAddress: subnet.networkAddress.toString(),
      broadcastAddress: subnet.broadcastAddress.toString(),
      firstHost: addOne(subnet.networkAddress).toString(),
      lastHost: subtractOne(subnet.broadcastAddress).toString(),
      hostCount: Math.pow(2, 32 - mask.prefixLengthFromSubnetMask()) - 2,
      cidr: `/${mask.prefixLengthFromSubnetMask()}`
    };
  } catch (e) {
    throw new Error('Некорректный IP или маска');
  }
}

function addOne(ip) {
  const bytes = ip.octets;
  let carry = 1;
  for (let i = bytes.length - 1; i >= 0; i--) {
    bytes[i] += carry;
    if (bytes[i] < 256) {
      carry = 0;
      break;
    }
    bytes[i] = 0;
  }
  return ipaddr.parse(bytes.join('.'));
}

function subtractOne(ip) {
  const bytes = ip.octets;
  let borrow = 1;
  for (let i = bytes.length - 1; i >= 0; i--) {
    if (bytes[i] > 0) {
      bytes[i] -= borrow;
      break;
    }
    bytes[i] = 255;
  }
  return ipaddr.parse(bytes.join('.'));
}