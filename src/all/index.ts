import adaptor from '../adaptor'
import { Collection } from '../collection'
import { wrapData } from '../data'
import { doc, Doc } from '../doc'
import { CollectionGroup } from '../group'
import { pathToRef, ref } from '../ref'

/**
 * Returns all documents in a collection.
 *
 * ```ts
 * import { all, collection } from 'typesaurus'
 *
 * type User = { name: string }
 * const users = collection<User>('users')
 *
 * all(users).then(allUsers => {
 *   console.log(allUsers.length)
 *   //=> 420
 *   console.log(allUsers[0].ref.id)
 *   //=> '00sHm46UWKObv2W7XK9e'
 *   console.log(allUsers[0].data)
 *   //=> { name: 'Sasha' }
 * })
 * ```
 *
 * @param collection - The collection to get all documents from
 * @returns A promise to all documents
 */
export default async function all<Model>(
  collection: Collection<Model> | CollectionGroup<Model>
): Promise<Doc<Model>[]> {
  const a = await adaptor()
  const firebaseSnap = await (collection.__type__ === 'collectionGroup'
    ? a.firestore.collectionGroup(collection.path)
    : a.firestore.collection(collection.path)
  ).get()
  return firebaseSnap.docs.map((snap) =>
    doc(
      collection.__type__ === 'collectionGroup'
        ? pathToRef(snap.ref.path)
        : ref(collection, snap.id),
      wrapData(a, snap.data()) as Model,
      a.getDocMeta(snap)
    )
  )
}
